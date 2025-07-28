const paypal = require('paypal-rest-sdk')

paypal.configure({
    mode:'sandbox',
    client_id:'ARYNSM3aLo76BuIpwLeiFmk_i4Pz46IsTi3J6EtG2alQROhyKGC1-1TYCLq71kd1aDoDrzxHFKpTh1AR',
    client_secret:'EHQmeFC1rvnV0o46jGEBRZKLw-kjpkRXSCJHdOW74gb9K1DcQBidG5r7MrfjFvw6qYA952H9tmgUfuv_',
})
module.exports=paypal