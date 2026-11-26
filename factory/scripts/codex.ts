// Runs one Codex review: read-only sandbox, structured answer, verdict decided here.

import { spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

export type Model = { model: string; effort: string };

type Finding = {
  severity: "blocking" | "note";
  file: string;
  line: number;
  problem: string;
  failure: string;
  fix: string;
};

export type Report = { summary: string; findings: Finding[] };

type Request = Model & {
  cwd: string;
  prompt: string;
  schema: string;
  output: string;
  timeoutMinutes: number;
};

function isReport(value: unknown): value is Report {
  const report = value as Partial<Report> | null;
  return (
    typeof report?.summary === "string" &&
    Array.isArray(report.findings) &&
    report.findings.every(
      (f) =>
        (f.severity === "blocking" || f.severity === "note") &&
        [f.file, f.problem, f.failure, f.fix].every((text) => typeof text === "string") &&
        Number.isInteger(f.line),
    )
  );
}

/** Resolves with a report, or rejects. A review that did not finish never counts as a pass. */
export function runCodex(request: Request): Promise<Report> {
  rmSync(request.output, { force: true });
  const args = [
    "exec",
    "--ephemeral",
    "--ignore-user-config",
    "--ignore-rules",
    "--sandbox",
    "read-only",
    "--cd",
    request.cwd,
    "--model",
    request.model,
    "--config",
    `model_reasoning_effort="${request.effort}"`,
    "--output-schema",
    request.schema,
    "--output-last-message",
    request.output,
    "-",
  ];

  return new Promise((done, fail) => {
    const child = spawn("codex", args, {
      stdio: ["pipe", "ignore", "pipe"],
      timeout: request.timeoutMinutes * 60_000,
    });
    let errors = "";
    child.stderr.on("data", (chunk: Buffer) => {
      errors = (errors + chunk.toString()).slice(-2000);
    });
    child.on("error", (error) => fail(new Error(`could not run codex: ${error.message}`)));
    child.on("close", (code, signal) => {
      if (code !== 0 || !existsSync(request.output)) {
        const why = signal ? `stopped by ${signal} (timeout?)` : `exit ${code}`;
        return fail(new Error(`codex ${request.model} failed, ${why}:\n${errors.trim()}`));
      }
      try {
        const report: unknown = JSON.parse(readFileSync(request.output, "utf8"));
        if (!isReport(report)) throw new Error("answer does not match the schema");
        done(report);
      } catch (error) {
        fail(new Error(`codex ${request.model}: ${(error as Error).message}`));
      }
    });
    child.stdin.end(request.prompt);
  });
}

export const blocks = (report: Report) => report.findings.some((f) => f.severity === "blocking");

export function render(name: string, model: Model, report: Report) {
  const lines = [
    `## ${name}: ${blocks(report) ? "CHANGES" : "PASS"} (${model.model}, ${model.effort})`,
    "",
    report.summary,
  ];
  for (const [index, f] of report.findings.entries()) {
    const where = f.line > 0 ? `${f.file}:${f.line}` : f.file;
    lines.push(
      "",
      `${index + 1}. **${f.severity}** \`${where}\`: ${f.problem}`,
      `   - Fails when: ${f.failure}`,
      `   - Fix: ${f.fix}`,
    );
  }
  return lines.join("\n");
}

export const promptFile = (root: string, name: string) =>
  readFileSync(join(root, "factory/prompts", `${name}.md`), "utf8").trim();
