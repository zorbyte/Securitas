import { Permissions } from "../lib";

export default interface UserGuild {
  id: string;
  perm?: Permissions;
}
