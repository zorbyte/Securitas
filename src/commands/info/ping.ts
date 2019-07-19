import { ICommand } from "../../lib";

const ping: ICommand = {
  name: "ping",
  aliases: ["p"],
  run({ msg, client, timer }) {
    const execTime = timer.lap(2);
    const pingTime = parseFloat(client.ws.ping / 8 + execTime);
    msg.channel.send(`:ping_pong: The ping latency is **≈${pingTime.toFixed(2)}ms**.\n:stopwatch: The execution time was **≈${execTime}ms**.`);
  },
}

export default ping;
