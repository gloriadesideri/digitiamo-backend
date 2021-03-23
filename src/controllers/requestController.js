const Request=require('../models/Request')
const axios=require('axios')


function setResponse(res, responseData){
    responseData.status=res["status"]
    responseData.message=res["statusText"]
    responseData.version=res["request"]["res"]["httpVersion"]
    responseData.path=res["request"]["path"]
    responseData.server=res["request"]["socket"]["servername"]
    responseData.protocol=res["request"]["agent"]["protocol"]
    responseData.data=res["data"]
    responseData.serverName=res.headers["server"]
    responseData.date=res.headers["date"]
    responseData.location=res.request.res.responseUrl

    return responseData

}
exports.createRequest=async (req,res)=>{
    try{
    let requestData={
        id:req.id,
        scheme:req.protocol,
        path:req.path,
        host:req.hostname,
        method:req.method,
        headers:req.headers
    }
    let responseData={}
    let config={
        method:req.body.method,
        url:req.body.url,
        headers:{},
        data: req.body.jbody


    }
    if(req.body.token!=''){
        config['headers']['Authorization']=`Bearer ${req.body.token}`
    }

    await axios(config).then(res=>{
        return responseData=setResponse(res,responseData)
    }).catch(e=>
        {
            return responseData=setResponse(e.response,responseData)
        }
    )



    let request=new Request({
        url:req.body.url,
        method:req.body.method
    })
        await request.save()


    return res.status(200).json({requestData,responseData})
    }catch (e) {
        console.log(e)
        res.status(500).json({"message":"unable to connect to database"})
    }

}
exports.getRequests=async (req,res)=>{
    let requests=await Request.find().sort({created: -1})
    res.status(200).json({requests})
}

