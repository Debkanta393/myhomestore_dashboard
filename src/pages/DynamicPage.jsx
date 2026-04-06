import { Render } from "@measured/puck";
import { config } from "../cms/config";

export default function DynamicPage({ data }) {
  return <Render config={config} data={data} />;
}