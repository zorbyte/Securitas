import { UserGuild } from ".";

export default interface User {
  id: string;
  email?: boolean;
  guilds?: UserGuild[];
  isMaintainer?: boolean;
}
