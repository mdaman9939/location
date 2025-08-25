const express = require('express');
const router = express.Router();
const ipinfo = require('ipinfo');

router.get('/location', async (req, res) => {
  // get ip address (check proxy headers first)
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // remove "::ffff:" if present (common in ipv6-mapped ipv4)
  if (ip.includes("::ffff:")) {
    ip = ip.split("::ffff:")[1];
  }

  // sometimes x-forwarded-for has multiple ips; take the first 
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  // get location info from ip
  ipinfo(ip, (err, cLoc) => {
    if (err) {
        return res.send("Error fetching location");
    }

    res.json({
        ip: ip,
        city: cLoc.city,
        region: cLoc.region,
        country: cLoc.country,
        org: cLoc.org, // isp / organization
        loc: cLoc.loc, // latitude , longitude
    })
  })
})


module.exports = router;