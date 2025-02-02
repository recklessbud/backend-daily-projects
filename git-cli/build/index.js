"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next()); 
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const commander_1 = require("commander");
const fetchUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.github.com/users/${username}/events`);
        return response.data;
    }
    catch (error) {
        console.log("error fetching user", error);
        process.exit(1);
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const program = new commander_1.Command();
    program
        .version('1.0.0')
        .description('fetch github user events')
        .argument('<username>', 'Github username')
        .action((username) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('fetching user events', username);
        const activityData = yield fetchUser(username);
        activityData.forEach((element) => {
            const createdAt = new Date(element.created_at);
            console.log(`${createdAt.toLocaleString()} : ${element.type} on ${element.repo.name}`);
        });
    }));
    program.parse(process.argv);
});
main();
