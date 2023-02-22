import dotenv from "dotenv";
dotenv.config();

interface IappConfig {
  mysql: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
}

const appConfig: IappConfig = {
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
};

export { appConfig, IappConfig };
