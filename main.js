let nd=new Date;
const oneMin=1000*60;

const trimTime=dateObj=>{
	const str=dateObj.toLocaleString();
	const sec=str.substr(str.indexOf(":")+4,3);

	return str.replace(sec,"");

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


const clickMagic=node=>{

	node.onclick=()=>{
		if(my$(".data .high").length!=0) my$(".data .high").classList.remove("high");
		node.querySelector("input").checked=true;
		node.classList.add("high");
	}

	node.querySelector(".del").onclick=()=>node.remove();	

}


const getDate=()=>{
	const d=new Date();
	return {
		month:d.getMonth()+1,
		date:d.getDate()
	}
}

const HR=1000*3600;

const getStamp=node=>node.dataset.stamp;
const msToHour=ms=>{
	const res=ms/HR;

	if(res==res.toFixed(2)) return res;
	else return res.toFixed(2);
}

const main=inOut=>{
	
	if(my$(".high").length==0) return;

	my$(".high .date").innerText=`${getDate().month}-${getDate().date}`;
	my$(".high .pw").innerText=`${form.place.value} / ${form.work.value}`;
	
	const out=valueToTime(my$(".time"));

	inOut.innerText=out.value;
	inOut.dataset.stamp=out.stamp;

	const stamp={}

	stamp.out=getStamp(my$(".high .out"));
	stamp.in=getStamp(my$(".high .in"));
	stamp.lunch=+form.lunch.value*HR;


	if(stamp.out>=stamp.in){
		my$(".high .hr").innerText=msToHour(stamp.out-stamp.in-stamp.lunch);
	}

	my$(".high .other").innerText=my$("#form .other").value;
}


my$("#in").onclick=()=>{
	addRow();
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

const addRow=()=>{
	const node=my$(".clone tr").cloneNode(true);
	clickMagic(node);
	node.click();
	my$(".data tbody").appendChild(node);
}


ajax({
	url:"http://192.168.0.109:3005/post",
	method:"post",
	data:{
		a:1,
		b:2
	},
	callback:res=>{}
});

my$(".lunch").onkeyup=e=>{

	const v=my$(".lunch").value;
	const oth=my$(".other");

	if(v==1) oth.value="";
	else oth.value=`${v} hr Break`;
}
//const sd=new Date(nd.toLocalDateString()); //second Date