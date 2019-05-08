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

const notHighlighted=()=>my$(".high").length==0;

const unHighlight=()=>{
	if(notHighlighted()) return;
	my$(".high .checkbox").checked=false;
	my$(".high").classList.remove("high");
}

const highlight=node=>{
	node.querySelector(".checkbox").checked=true;
	node.classList.add("high");	
}

const clickMagic=node=>{

	node.onclick=()=>{
		if(notHighlighted()==false) unHighlight();
		highlight(node);
	}

	node.querySelector(".del").onclick=()=>{
		node.onclick=null;
		node.remove();
		getTotal();
	}
}

const getDate=date=>{
	const d=new Date(date);
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



const main=cell=>{
	
	if(notHighlighted()) return;

	const d=getDate(my$(".time").value);

	my$(".high .date").innerText=`${d.month}-${d.date}`;
	my$(".high .place").innerText=`${form.place.value}`;
	my$(".high .work").innerText=`${form.work.value}`;
	

	const out=valueToTime(my$(".time"));

	cell.innerText=out.value;
	cell.dataset.stamp=out.stamp;

	const stamp={}

	stamp.out=getStamp(my$(".high .out"));
	stamp.in=getStamp(my$(".high .in"));
	stamp.lunch=+form.lunch.value*HR;

	if(stamp.out>=stamp.in){
		my$(".high .hour").innerText=msToHour(stamp.out-stamp.in-stamp.lunch);
	}

	my$(".high .other").innerText=my$("#form .other").value;

	getTotal();
}

my$("#in").onclick=e=>{
	main(my$(".data .high .in"));
}

my$("#out").onclick=e=>{
	main(my$(".data .high .out"));
}

my$("#newin").onclick=e=>{
	addRow();
	my$("#in").click();
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

const getTotal=()=>{
	if(my$(".data tbody tr").length==0) return;
	my$("#total").innerText=my$(".hour").map(x=>Number(x.innerText)).reduce((a,b)=>a+b);
}

const sheetlist=cb=>{
	ajax({
		url:"http://192.168.0.109:3005/sheetlist",
		method:"get",
		callback:res=>{
			res.forEach((x,i)=>{
				const html=`<option id="${x.id}">${x.sheet}</option>`;
				my$("#sheet").innerHTML+=html;

				if(i==0) data(x.id);

			});
		}
	});
}

my$("#sheet").onchange=ev=>{
	data(sheetId());
}

const data=id=>{

	ajax({
		url:`http://192.168.0.109:3005/data?id=${id}`,
		method:"get",
		callback:res=>{
			jstrToTab(res[0].datastr);
		}
	});

}

sheetlist();

my$(".lunch").onkeyup=e=>{

	const v=my$(".lunch").value;
	const oth=my$(".other");

	if(v==1) oth.value="";
	else oth.value=`${v} hr Break`;
}

my$("#delsheet").onclick=ev=>{
	const an=confirm("Are you sure?");
	console.log(an);
}

const sheetId=x=>{
	const index=my$("#sheet").selectedIndex;
	return my$("#sheet").options[index].id;
}


const saveDone=msg=>{
	const el=my$("#saveto");
	const txt=el.innerText;
	el.innerText=msg;
	setTimeout(()=>{el.innerText=txt},2000);
}

my$("#saveto").onclick=ev=>{
	ajax({
		url:"http://192.168.0.109:3005/update",
		method:"post",
		data:{
			id:sheetId(),
			datastr:tabToJstr()
		},
		callback:res=>saveDone(res.msg)
	});
}

const jstrToTab=str=>{

	//console.log(JSON.parse(str));
 
 	const json=JSON.parse(str);

 	if(json.length==0) return;

	for(const x of json){
		const node=my$(".clone tr").cloneNode(true);

		node.querySelector(".date").innerText=x.date;
		node.querySelector(".in").innerText=x.timein;
		node.querySelector(".out").innerText=x.timeout;
		node.querySelector(".place").innerText=x.place;
		node.querySelector(".work").innerText=x.work;
		node.querySelector(".hour").innerText=x.hour;
		node.querySelector(".other").innerText=x.other;

		clickMagic(node);

		my$(".data tbody").appendChild(node);

	}

	getTotal();

}

const tabToJstr=x=>{

	const innTxt=(x,sel)=>x.querySelector(sel).innerText;

	const arr=[];

	for(const x of my$(".data").querySelectorAll("tbody tr")){

		const obj={
			date:innTxt(x,".date"),
			timein:innTxt(x,".in"),
			timeout:innTxt(x,".out"),
			place:innTxt(x,".place"),
			work:innTxt(x,".work"),
			other:innTxt(x,".other"),
			hour:innTxt(x,".hour")
		}

		arr.push(obj);
	}


	return JSON.stringify(arr);

}

