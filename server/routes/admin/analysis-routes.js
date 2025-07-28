const express = require('express')
const router = express.Router()

const { getAdminDashboardSummary } = require('../../controllers/admin/analysis-controller')

router.get('/orders/get', getAdminDashboardSummary);
module.exports =router