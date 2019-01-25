/*beta sep 7 2018*/
const ajax=obj=>{
	const xml=new XMLHttpRequest;
	xml.open(obj.method,obj.url);
	xml.responseType="json";

	if(obj.method=="get"){
		xml.send();
	}

	else if(obj.method=="post"){
		const fd=new FormData;
		for(key in obj.data) fd.append(key,obj.data[key]);

		if(obj.formdata) xml.send(obj.data);
	  else xml.send(fd);
	}

	xml.onload=()=>{
		if(obj.callback) obj.callback(xml.response);
	}
}

const getHTML=obj=>{
	const xml=new XMLHttpRequest;
	xml.open("get",obj.url);
	xml.responseType="document";
	xml.send();
	xml.onload=()=>{
		if(obj.callback) obj.callback(xml.response);
	}
}

const getISOTime=date=>{
  date=new Date(date);
  return new Date(date-date.getTimezoneOffset()*60000).toISOString().replace(/T|Z/g," ").substr(0,19);
}

const getISO=(ISOTime,type)=>{
	if(type=="date") return ISOTime.substr(0,10);
	else if(type="time") return ISOTime.substr(11);
}

/*NodeList.prototype.addClass=HTMLCollection.prototype.addClass=function(cn){
  for(const x of this) x.classList.add(cn)
}

NodeList.prototype.removeClass=HTMLCollection.prototype.removeClass=function(cn){
  for(const x of this) x.classList.remove(cn)
}*/

NodeList.prototype.map=Array.prototype.map;

const getParameterByName=(name, url) =>{
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const my$=selector=>{
	const all=document.querySelectorAll(selector);
	if(all.length==0||all.length>1) return all;
	else if(all.length==1) return all[0]
}

const zero=data=>{
	if(data) return data;
	else return 0;
}