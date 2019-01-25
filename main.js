const nd=new Date;
const min=nd.getMinutes();
const remi=min%5;

const trimTime=dateObj=>{
	const str=dateObj.toLocaleString();
	const sec=str.substr(15,3);
	return str.replace(sec,"");
}



const oneMin=1000*60;
const stamp=dateObj=>{
	return +new Date(dateObj);
}

my$(".time").value=trimTime(nd);

console.log(trimTime(nd));

my$(".up").onclick=()=>{
	const newStamp=stamp(nd)+(5-remi)*oneMin;
	const sd=new Date(newStamp);
	my$(".time").value=trimTime(sd);
}

my$(".down").onclick=()=>{
	const newStamp=stamp(nd)-remi*oneMin;
	const sd=new Date(newStamp);
	my$(".time").value=trimTime(sd);
}

//const sd=new Date(nd.toLocalDateString()); //second Date