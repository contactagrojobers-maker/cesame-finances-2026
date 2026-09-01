const { state } = require('./_lib');
module.exports=async(req,res)=>{
  try { await state(); return res.status(200).json({status:'ok',service:'CESAME Finances API',database:'connected'}); }
  catch(error) { return res.status(500).json({status:'error',service:'CESAME Finances API',database:'unavailable',error:error.message}); }
};
