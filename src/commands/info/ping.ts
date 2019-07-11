

import { ICommand } from "../../middleware/message/commandDispatcher";

const ping: ICommand = {
  name: "ping",
  aliases: ["p"],
  run(msg, { client, timer }) {
    const execTime = timer.stop(2);
    const pingTime = parseFloat((client.ws.ping / 8).toFixed(2)) + execTime;
    msg.channel.send(`:ping_pong: The ping latency is **≈${pingTime}ms**.\n:stopwatch: The execution time was **≈${execTime}ms**.`);
  }
}

export default ping;
