function index(args) {
       return { result: "Hello World! " + args.name }
}

global.main = index;
