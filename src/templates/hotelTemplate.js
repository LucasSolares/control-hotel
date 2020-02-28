const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')
const nanoid = require('nanoid')
const exists = require('../util/exists')
const config = require('../config')


async function hotelsDirCreate() {
    const HOTEL_URL = path.resolve(
        config.PUBLIC_DIRECTORY,
        config.REPORT_DIRECTORY,
        'hotels'
    )

    if (!(await exists.existsDir(HOTEL_URL))) {
        await new Promise((resolve, reject) => {
            fs.mkdir(HOTEL_URL, { recursive: true }, (err) => {
                if (err) {
                    reject({ error: 'There was an error in the creation of hotel dir' })
                }
                resolve()
            })
        })
    }
}

exports.generateReport = async(hotel) => {
    const URL_REPORT = path.join(
        config.PUBLIC_DIRECTORY,
        config.REPORT_DIRECTORY,
        'hotels',
        `${new Date().getTime()}-${nanoid()}.pdf`
    )
    const FINAL_URL = path.resolve(URL_REPORT)
    try {
        await hotelsDirCreate()
        const doc = new PDFDocument({ pdfVersion: '1.7', autoFirstPage: false })
        doc.pipe(fs.createWriteStream(FINAL_URL))

        doc.addPage({
            margin: 50
        })

        doc.font('Times-Roman')
            .fontSize(32)
            .text('Informe Hotel', {
                align: 'center'
            })

        doc.moveDown(2)


        doc.font('Times-Roman')
            .fontSize(28)
            .fillColor('red')
            .text(`ID: ${hotel._id}`)

        doc.moveDown(1)

        doc.fontSize(24)
            .fillColor('blue')
            .text(`Nombre Hotel: ${hotel.name}`)

        doc.moveDown(1)

        doc.text(`Ciudad: ${hotel.country}`)

        doc.moveDown(1)

        doc.text(`Precio: ${hotel.price}`)

        doc.moveDown(1)

        doc.text(`Disponibilidad: ${hotel.availability}`)

        doc.moveDown(1)

        doc.text(`Calificación: ${hotel.qualification}`)


        doc.end()
        return `http://${config.HOST}:${config.PORT}${URL_REPORT.replace(
            config.PUBLIC_DIRECTORY,
            ''
        )}`
    } catch (error) {
        console.error(error)
        throw error
    }
}