import { Properties } from "csstype";

export class ComponentManifestStyleModel {
  variantKey!: string;
  cssProperty!: keyof Properties;
  rawValue!: string;
}
