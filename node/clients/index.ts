import { IOClients } from "@vtex/api";
import Analytics from "./analytics";

export default class Clients extends IOClients {
  public get analytics () {
    return this.getOrSet('analytics', Analytics)
  }
}