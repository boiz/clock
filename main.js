let nd=new Date;
const oneMin=1000*60;

const trimTime=dateObj=>{
	const str=dateObj.toLocaleString();
	const sec=str.substr(str.indexOf(":")+4,3);
	//console.log(str,sec);
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


const stopTick=()=>{
	clearInterval(intv);
	my$(".time").classList.remove("blink");
}

const tick=dir=>{
	const min=nd.getMinutes();
	const remi=min%5;

	let newStamp;

	if(dir=="up") newStamp=stamp(nd)+(5-remi)*oneMin;
	else if(dir=="down") newStamp=stamp(nd)-remi*oneMin;
	
	const sd=new Date(newStamp);

	my$(".time").value=trimTime(sd);
	stopTick();
}

my$(".time").value=trimTime(nd);
my$(".time").onclick=stopTick;

my$(".up").onclick=()=>{
	tick("up");
}

my$(".down").onclick=()=>{
	tick("down");
}

for(const x of my$(".data tbody tr")){
	x.onclick=()=>{
		if(my$(".data .high").length!=0) my$(".data .high").classList.remove("high");
		x.querySelector("input").checked=true;
		x.classList.add("high");
	}
}

const getDate=()=>{
	const d=new Date();
	return {
		month:d.getMonth()+1,
		date:d.getDate()
	}
}

const getStamp=node=>node.dataset.stamp;
const msToHour=ms=>(ms/1000/3600).toFixed(2);

const main=inOut=>{

	my$(".data .high .date").innerText=`${getDate().month}-${getDate().date}`;
	my$(".data .high .pw").innerText=`${form.place.value} / ${form.work.value}`;
	const out=valueToTime(my$(".time"));
	inOut.innerText=out.value;
	inOut.dataset.stamp=out.stamp;


	const stamp={}

	stamp.out=getStamp(my$(".data .high .out"));
	stamp.in=getStamp(my$(".data .high .in"));

	if(stamp.out>stamp.in){
		my$(".data .high .hr").innerText=msToHour(stamp.out-stamp.in);
	}
}


my$("#in").onclick=()=>{
	main(my$(".data .high .in"));
}

my$("#out").onclick=()=>{
	main(my$(".data .high .out"));
}



form.onsubmit=()=>false;


const minus=timeNode=>{
	new Date(timeNode.value)
}

const valueToTime=timeNode=>{
	const out={};
	const obj=new Date(timeNode.value);

	out.stamp=+obj;
	out.value=obj.toLocaleTimeString().replace(":00","");

	return out;
}

//const sd=new Date(nd.toLocalDateString()); //second Date