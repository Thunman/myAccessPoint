import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { wake } from "wol";
import Docker from "dockerode";
import ping from "ping";

const docker = new Docker();

export const userController = {
  login: async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (
        username === process.env.USERNAME &&
        password === process.env.PASSWORD
      ) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
        res.cookie("loggedIn", true);
        res.status(200).json({
          success: true,
          message: "Success",
          data: {},
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Errorcode 2",
          data: {},
        });
      }
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: "Errorcode: 2",
        data: {},
      });
    }
  },
  getLogs: async (req: Request, res: Response) => {
    try {
      const filePath = path.resolve(__dirname, "../../logs/logs.log");
      if (fs.existsSync(filePath)) {
        const logFile = fs.readFileSync(filePath, "utf8");
        res.json({
          success: true,
          message: "Log file fetched successfully",
          data: { logs: logFile },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Log file not found.",
          data: {},
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the logs.",
        data: {},
      });
    }
  },
  getStatus: async (req: Request, res: Response) => {
    try {
      const container = docker.getContainer("mongo");
      const mongo = await container.inspect();
      const isMongoRunning = mongo.State.Running;

      ping.sys.probe("192.168.50.9", function (isPCRunning) {
        res.status(200).json({
          success: true,
          message: "Here you go",
          data: { mongo: isMongoRunning, pc: isPCRunning },
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error getting status",
        data: {},
      });
    }
  },
  stopMongo: async (req: Request, res: Response) => {
    try {
      const container = await docker.getContainer("mongo");
      container.stop((error) => {
        if (!error)
          res.status(200).json({
            success: true,
            message: "Mongo stopped",
            data: {},
          });
        else throw new Error();
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error stoping",
        data: error,
      });
    }
  },
  startMongo: async (req: Request, res: Response) => {
    try {
      const container = await docker.getContainer("mongo");
      container.start((error) => {
        if (!error)
          res.status(200).json({
            success: true,
            message: "Mongo started",
            data: {},
          });
        else throw new Error();
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error starting",
        data: error,
      });
    }
  },

  hibernatePC: async (req: Request, res: Response) => {
    try {
      const command = `sshpass -p ${process.env.SSH_PASSWORD} ssh ${process.env.SSH_USERNAME}@192.168.50.9 "shutdown -h"`;
      exec(command, (error) => {
        if (error) {
          throw new Error();
        }
      });
      res.json({ success: true, message: "PC is hibernating", data: {} });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error hibernating PC",
        data: {},
      });
    }
  },

  wakePC: async (req: Request, res: Response) => {
    wake("08-BF-B8-73-9B-E4", (error) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .json({ success: false, message: `${error}`, data: {} });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Success", data: {} });
      }
    });
  },

  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("token");
      res.clearCookie("loggedIn");
      res.status(200).json({
        success: true,
        message: "logged out",
        data: {},
      });
    } catch {
      res.status(500).json({ success: false, message: "error", data: {} });
    }
  },
  getDiskStatus: async (req: Request, res: Response) => {
    try {
      exec(
        "df -h --output=source,size,avail,pcent",
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({
              success: false,
              message: "Error getting disk status",
              data: {},
            });
          }

          let lines = stdout.split("\n");
          lines = lines.slice(1, lines.length - 1);

          const drives = lines.map((line) => {
            const cols = line.replace(/\s+/g, " ").trim().split(" ");
            return {
              filesystem: cols[0],
              size: cols[1],
              available: cols[2],
              usePercentage: cols[3],
            };
          });

          res.status(200).json({
            success: true,
            message: "Disk status fetched successfully",
            data: drives,
          });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching the disk status.",
        data: {},
      });
    }
  },
};
