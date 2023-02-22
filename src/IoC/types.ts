const TYPES = {
  MySQLClient: Symbol.for("MySQLClient"),

  UserService: Symbol.for("UserService"),
  UserController: Symbol.for("UserController"),
};

Object.seal(TYPES);

export default TYPES;
