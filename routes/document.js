const express = require('express')
const document = express()

document.get('/documents', function (req, res) {
  res.send('Get all Document')
})
document.get('/documents/i/:id', function (req, res) {
    res.send('Search Document')
})
document.post('/documents', function (req, res) {
    res.send('Upload Document')
})
document.delete('/documents/i/:id', function (req, res) {
    res.send('Delete Document')
})
document.patch('/documents/i/:id', function (req, res) {
    res.send('Update Document')
})


document.listen(3000)