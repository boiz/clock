let nd=new Date;
const oneMin=1000*60;

const trimTime=dateObj=>{
	const str=dateObj.toLocaleString();
	const sec=str.substr(15,3);
	return str.replace(sec,"");
	//return str;
}

const stamp=dateObj=>{
	return +new Date(dateObj);
}

const intv=setInterval(()=>{
	nd=new Date;
	my$(".time").value=trimTime(nd);
},1000);


const doIt=dir=>{

	const min=nd.getMinutes();
	const remi=min%5;

	let newStamp;

	if(dir=="up") newStamp=stamp(nd)+(5-remi)*oneMin;
	else if(dir=="down") newStamp=stamp(nd)-remi*oneMin;
	
	const sd=new Date(newStamp);

	my$(".time").value=trimTime(sd);
	clearInterval(intv);
	my$(".time").classList.remove("blink");

}

my$(".time").value=trimTime(nd);

my$(".up").onclick=()=>{
	doIt("up");
}

my$(".down").onclick=()=>{
	doIt("down");
}

//const sd=new Date(nd.toLocalDateString()); //second Date