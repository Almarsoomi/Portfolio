import type { ComponentType } from "react";
import type { ProjectDemo } from "@/data/portfolio";
import CarePlusDemo from "./CarePlusDemo";
import MetalEastDemo from "./MetalEastDemo";
import MyBoatLogDemo from "./MyBoatLogDemo";
import PreStatementDemo from "./PreStatementDemo";
import TheWallsDemo from "./TheWallsDemo";

/** Animated mini-demos shown in place of the icon/number on project cards. */
export const demos: Record<ProjectDemo, ComponentType> = {
  prestatement: PreStatementDemo,
  myboatlog: MyBoatLogDemo,
  careplus: CarePlusDemo,
  thewalls: TheWallsDemo,
  metaleast: MetalEastDemo,
};
