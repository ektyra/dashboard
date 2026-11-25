import type { Meta, StoryObj } from "@storybook/react-vite";
import { Marker, Popup } from "react-leaflet";
import { pinIcon, ThemedMap } from "../components/map-base";
import { MapFrame } from "../components/map-frame";
import { QrCode } from "../components/qr-code";

const meta = { title: "Extras/Map and QRCode", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Map: Story = {
  name: "Map (needs network for tiles)",
  render: () => (
    <div className="w-[36rem]">
      <MapFrame height={320}>
        <ThemedMap center={[52.3676, 4.9041]} zoom={12} scrollWheelZoom={false}>
          <Marker position={[52.3676, 4.9041]} icon={pinIcon(true)}>
            <Popup>Amsterdam</Popup>
          </Marker>
        </ThemedMap>
      </MapFrame>
    </div>
  ),
};

export const PlainTiles: Story = {
  render: () => (
    <div className="w-[36rem]">
      <MapFrame height={240}>
        <ThemedMap tiles="plain" center={[51.9244, 4.4777]} zoom={11} scrollWheelZoom={false} />
      </MapFrame>
    </div>
  ),
};

export const Qr: Story = {
  name: "QRCode",
  render: () => (
    <div className="flex gap-6">
      <QrCode value="https://ektyra.com" label="QR code for ektyra.com" />
      <QrCode
        value="otpauth://totp/Ektyra:ada@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Ektyra"
        size={120}
        label="Authenticator setup code"
      />
    </div>
  ),
};
