import dotenv from "dotenv";
dotenv.config();

interface IappConfig {
  app: {
    url: string;
    port: number;
    production: boolean;
    secret: string;
    expiresIn: string;
  };
  mysql: {
    host: string;
    user: string;
    password: string;
    database: string;
  };
}

const appConfig: IappConfig = {
  app: {
    url: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    production: false,
    secret:process.env.SECRET_KEY_JWT,
    expiresIn: "24h",
    // https: {
    //   port: 8443,
    //   tls: {
    //     certificate: "tls/server.crt",
    //     key: "tls/key.pem",
    //   },
    // },
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
};

export { appConfig, IappConfig };
