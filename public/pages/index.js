import { useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import io from 'socket.io-client'

let socket

export default function Home () {
  const [search, setSearch] = useState({ url: '', tor: false })
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [article, setArticle] = useState(null)
  const [jsonData, setJsonData] = useState('')
  const [tab, setTab] = useState('text')

  useEffect(() => {
    socket = io()

    socket.on('parse:article', (a) => {
      const json = {
        title: a.title,
        titlePreview: a.titlePreview,
        metadescription: a.metadescription,
        url: a.url,
        sentiment: { score: a.sentiment.score, comparative: a.sentiment.comparative },
        keyphrases: a.keyphrases,
        people: a.people,
        orgs: a.orgs,
        places: a.places
      }
      setJsonData(JSON.stringify(json, null, 2))

      const fixLen = (str, len) => {
        if (!str) return ''
        return str.length > len ? str.substring(0, len) + '...' : str
      }
      a.metadescription = fixLen(a.metadescription, 158)
      a.titlePreview = fixLen(a.title, 71)
      a.url = fixLen(a.url, 71)

      setArticle(a)
      setProcessing(false)
      setStatus('')
    })

    socket.on('parse:error', () => setProcessing(false))

    socket.on('parse:status', (msg) => {
      setStatus(s => s + msg + ' \n')
    })

    return () => {
      socket.close()
    }
  }, [])

  const getResults = (e) => {
    e.preventDefault()
    setStatus('')
    setArticle(null)
    setProcessing(true)
    socket.emit('parse:article', search)
  }

  return (
    <div>
      <Head>
        <title>Page Inspector - Page Analysis Tool</title>
        <meta name='description' content='Web Page Inspection Tool. Sentiment Analysis, Keyword Extraction & Named Entity Recognition' />
      </Head>
      <Script src='https://code.jquery.com/jquery-3.5.1.min.js' strategy='afterInteractive' />
      <Script src='https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js' strategy='afterInteractive' />
      <div className='container'>
        <div className='col-md-12'>
          <h1>Page Inspector - Page Analysis Tool</h1>
          <p>Web Page Inspection Tool. Sentiment Analysis, Keyword Extraction & Named Entity Recognition</p>
          <form onSubmit={getResults}>
            <div className='form-group'>
              <label>Page URL</label>
              <input type='url' className='form-control' placeholder='e.g. google.com' value={search.url} onChange={(e) => setSearch({ ...search, url: e.target.value })} disabled={processing} />
            </div>
            <div className='checkbox'>
              <label><input type='checkbox' checked={search.tor} onChange={(e) => setSearch({ ...search, tor: e.target.checked })} />Use Tor Proxy (Enables analysis of .onion URLs)</label>
            </div>
            <button type='submit' className='btn btn-default' disabled={processing}>Analyse {processing && <i className='fas fa-circle-notch fa-spin'></i>}</button>
          </form>
        </div>

        {status && (
          <div className='article col-sm-12'>
            <pre className='status'>{status}</pre>
          </div>
        )}

        {article && (
          <>
            <div className='article col-sm-6'>
              <h3>Google Preview</h3>
              <div className='google-preview'>
                <a className='title'>{article.titlePreview}</a>
                <span className='url'>{article.url}</span>
                <p className='description'>{article.metadescription}</p>
              </div>

              {article.sentiment && (
                <div className='sentiment'>
                  <h3>Sentiment</h3>
                  <span className='label place label-default'>{article.sentiment.result}</span>
                </div>
              )}
              {article.keyphrases.length > 0 && (
                <div className='keyphrases'>
                  <h3>Keyphrases</h3>
                  {article.keyphrases.map((k) => <span key={k.keyphrase} className='label keyphrase label-default'>{k.keyphrase}</span>)}
                </div>
              )}
              {article.people.length > 0 && (
                <div className='people'>
                  <h3>People</h3>
                  {article.people.map((p) => <span key={p} className='label person label-default'>{p}</span>)}
                </div>
              )}
              {article.orgs.length > 0 && (
                <div className='orgs'>
                  <h3>Organisations &amp; Groups</h3>
                  {article.orgs.map((o) => <span key={o} className='label org label-default'>{o}</span>)}
                </div>
              )}
              {article.places.length > 0 && (
                <div className='places'>
                  <h3>Places</h3>
                  {article.places.map((p) => <span key={p} className='label place label-default'>{p}</span>)}
                </div>
              )}
              {article.spelling.length > 0 && (
                <div className='spelling'>
                  <h3>Spelling</h3>
                  <ul>
                    {article.spelling.map((w, i) => <li key={i}><span className='label label-default'>Line {w.line}</span>{w.reason}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <div className='screenshot col-sm-6'>
              <ul className='nav nav-tabs'>
                <li className={tab === 'text' ? 'active' : ''}><a onClick={() => setTab('text')}>Text</a></li>
                <li className={tab === 'html' ? 'active' : ''}><a onClick={() => setTab('html')}>HTML</a></li>
                <li className={tab === 'screenshot' ? 'active' : ''}><a onClick={() => setTab('screenshot')}>Screenshot</a></li>
                <li className={tab === 'json' ? 'active' : ''}><a onClick={() => setTab('json')}>Analysis JSON</a></li>
              </ul>
              {tab === 'text' && (
                <pre className='content article-text-content' dangerouslySetInnerHTML={{ __html: article.text.html }} />
              )}
              {tab === 'html' && (
                <div>
                  <h1 className='content article-text-title'>{article.title}</h1>
                  <div className='content article-text-content' dangerouslySetInnerHTML={{ __html: article.html }} />
                </div>
              )}
              {tab === 'screenshot' && (
                <Image src={`data:image/png;base64,${article.screenshot}`} alt='' width={768} height={2048} unoptimized />
              )}
              {tab === 'json' && (
                <pre className='content article-text-content'>{jsonData}</pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

