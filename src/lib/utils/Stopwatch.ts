import { performance } from "perf_hooks";

const kInspect = Symbol.for("nodejs.util.inspect.custom");

class Stopwatch {
  private start = performance.now();
  private stopped = false;
  private laps: number[] = [];

  public get(lapID: number, toFixed?: number): string {
    const chosenLap = this.laps[lapID];
    if (!chosenLap) throw new RangeError(`Lap with ID ${lapID} does not exist!`);
    return this.toFixTime(toFixed, chosenLap);
  }

  private toFixTime(toFixedAmnt: number | undefined, time: number): string {
    return time.toFixed(toFixedAmnt);
  }

  public lap(toFixedAmnt?: number): string {
    if (this.stopped) throw new Error("Stopwatch has already been stopped.");
    const lapTime = performance.now() - this.start;
    this.laps.push(lapTime);
    return this.toFixTime(toFixedAmnt, lapTime);
  }

  public stop(toFixedAmnt?: number): string {
    const finishTime = this.lap(toFixedAmnt);
    this.stopped = true;
    return finishTime;
  }

  public [kInspect](): string {
    return `${this.lap.length ? this.get(this.lap.length - 1) : 0}ms`;
  }
}

export default Stopwatch;
