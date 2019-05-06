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

const main=inOut=>{
	
	if(notHighlighted()) return;

	const d=getDate(my$(".time").value);

	my$(".high .date").innerText=`${d.month}-${d.date}`;
	my$(".high .place").innerText=`${form.place.value}`;
	my$(".high .work").innerText=`${form.work.value}`;
	

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

const getTotal=()=>my$("#total").innerText=my$(".hr").map(x=>Number(x.innerText)).reduce((a,b)=>a+b);


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
			my$(".data tbody").innerHTML=jstrToTab(res[0].datastr);
			for(const node of my$(".data tbody tr")) clickMagic(node);
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


my$("#saveto").onclick=ev=>{
	ajax({
		url:"http://192.168.0.109:3005/update",
		method:"post",
		data:{
			id:sheetId(),
			datastr:tabToJstr()
		}
	});

}


const jstrToTab=str=>{

	let html="";
 
	for(const x of JSON.parse(str)){
		html+=
		`
		<tr>
			<td><input type="checkbox" class="checkbox" name="select"></td>
			<td class="date">${x.date}</td>
			<td class="in">${x.timein}</td>
			<td class="out">${x.timeout}</td>
			<td class="pw">
				<span class="place">${x.place}</span>
				<span> / </span>
				<span class="work">${x.work}</span>
			</td>
			<td></td>
			<td class="hr"></td>
			<td class="other">${x.other}</td>
			<td><a class="del"><img src="x.png"></a></td>
		</tr>
		`
	}

	return html;


		
}

const tabToJstr=x=>{

	const tool=(x,sel)=>{
		return x.querySelector(sel).innerText;
	}

	const arr=[];

	for(const x of my$(".data tbody tr")){

		const obj={
			date:tool(x,".date"),
			timein:tool(x,".in"),
			timeout:tool(x,".out"),
			place:tool(x,".place"),
			work:tool(x,".work"),
			other:tool(x,".other")
		}

		arr.push(obj);
	}

	return JSON.stringify(arr);

}





