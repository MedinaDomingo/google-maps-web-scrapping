const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/search', async (req, res) => {
    const query = req.query.q; 

    if (!query) {
        return res.status(400).json({ error: 'No hay consult de busqueda ' });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();

        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(query)}/`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });

        await page.waitForSelector('body');

        const lugares = await page.evaluate(() => {
            const datos = [];
            const elementos = document.querySelectorAll('div.Nv2PK');
            elementos.forEach(elemento => {
                const nombre = elemento.querySelector('.qBF1Pd.fontHeadlineSmall')?.textContent.trim();
                const href = elemento.querySelector('a.hfpxzc')?.getAttribute('href');

                if (nombre && href) {
                    datos.push({
                        nombre,
                        href
                    });
                }
            });

            return datos;
        });

        async function extraerInformacionLugar(url) {
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'networkidle2' });

            const infoLugar = await page.evaluate(() => {
                const nombre = document.querySelector('.DUwDvf.lfPIob')?.textContent.trim();
                const calificacion = document.querySelector('.fontBodyMedium.dmRWX .F7nice >span')?.textContent.trim();
                const opiniones = document.querySelector('.fontBodyMedium.dmRWX>span:nth-of-type(2)')?.textContent.trim();
                const direccion = document.querySelector('.rogA2c')?.textContent.trim();

                const comentarios = Array.from(document.querySelectorAll('.jftiEf.fontBodyMedium')).map(el => {
                    const nombreComentario = el.querySelector('.d4r55')?.textContent.trim();
                    const comentarioTexto = el.querySelector('.wiI7pd')?.textContent.trim();
                    const primeraImagenElemento = el.querySelector('.Tya61d');

                    // Solamente trae la primera imagen --- !Revisar porque no se puede iterar sobre todas¡
                    const imagenUrl = primeraImagenElemento ? primeraImagenElemento.style.backgroundImage.match(/url\("(.*?)"\)/)?.[1] : null;

                    return {
                        nombre: nombreComentario,
                        comentario: comentarioTexto,
                        imagen: imagenUrl 
                    };
                });

                return {
                    nombre,
                    calificacion,
                    opiniones,
                    direccion,
                    comentarios
                };
            });

            await page.close();
            return infoLugar;
        }

        const lugaresConDetalles = [];
        for (const lugar of lugares) {
            if (lugar.href) {
                const infoLugar = await extraerInformacionLugar(lugar.href);
                lugaresConDetalles.push(infoLugar);
            }
        }

        await browser.close();

        res.json(lugaresConDetalles);
    } catch (error) {
        console.error('Error al extraer la información:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
