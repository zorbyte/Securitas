import { Stopwatch, Client } from "../index";

class Context {
  public timer = new Stopwatch();
  [key: string]: any;

  constructor (public client: Client) {};
}

export default Context;
