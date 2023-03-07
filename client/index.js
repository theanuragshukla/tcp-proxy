require("dotenv").config();
const net = require("net");
const PORT = process.env.PORT || 3000;
let REM_HOST = "";
let REM_PORT = 8080;

const sendToRemote = (socket, msg) => {
	 var serviceSocket = new net.Socket();
	        serviceSocket.connect(parseInt(REM_PORT), REM_HOST, function () {
		            serviceSocket.write(msg);
		        });
	        serviceSocket.on("data", function (data) {
		            socket.write(data);
		        });
}

var server = net.createServer(function (socket) {
	    socket.on('data', function (msg) {
		try{
			const str = msg.toString()
			const json = JSON.parse(str)
			if(json.SETREM===true){
				const {PORT, HOST} = json
				if(PORT){
					REM_PORT = parseInt(PORT)
				}
				if(HOST){
					REM_HOST = HOST
				}
			}else{
				sendToRemote(socket, msg)
			}
		}catch{
			sendToRemote(socket, msg)
		}
		       
    });
});
 
server.listen(PORT, ()=>{
	console.log(`tcp proxy running on ${PORT}`)
});

