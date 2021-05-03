import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render () {
        return (
          <Html>
            <Head>
              <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                crossOrigin="anonymous"
              />
            </Head>
            <body>
              <Main />
              <script
                src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
                integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
                crossOrigin="anonymous" 
              ></script>
              <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-Piv4xVNRyMGpqkS2by6br4gNJ7DXjqk09RmUpJ8jgGtD7zP9yug3goQfGII0yAns"
                crossOrigin="anonymous"
              ></script>
            </body>
            <NextScript />
          </Html>
        );
    } 
}

export default MyDocument;