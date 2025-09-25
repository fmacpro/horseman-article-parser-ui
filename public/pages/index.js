import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import io from 'socket.io-client'

let socket

const MAX_KEY_POINTS = 3

const formatNumber = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return value.toLocaleString()
}

const formatReadingTime = (seconds) => {
  if (typeof seconds !== 'number' || Number.isNaN(seconds)) return null
  if (seconds < 60) return '< 1 minute'
  const minutes = Math.max(1, Math.round(seconds / 60))
  return `${minutes} minutes`
}

const buildReadabilityItems = (readability) => {
  if (!readability) return []
  const items = [
    { label: 'Reading Time', value: formatReadingTime(readability.readingTime) },
    { label: 'Words', value: formatNumber(readability.words) },
    { label: 'Sentences', value: formatNumber(readability.sentences) },
    { label: 'Paragraphs', value: formatNumber(readability.paragraphs) },
    { label: 'Characters', value: formatNumber(readability.characters) }
  ]

  return items.filter(item => Boolean(item.value))
}

const sentimentClassName = (label) => {
  if (typeof label !== 'string' || label.trim() === '') return 'sentiment-badge'
  const normalized = label.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')
  return `sentiment-badge sentiment-${normalized}`.trim()
}

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
      const sentences = Array.isArray(a?.text?.sentences) ? a.text.sentences.filter(Boolean) : []
      const keyPoints = sentences.slice(0, MAX_KEY_POINTS)
      const sentimentSummary = a.sentiment
        ? { score: a.sentiment.score, comparative: a.sentiment.comparative }
        : null

      const json = {
        title: a.title,
        titlePreview: a.titlePreview,
        metadescription: a.metadescription,
        url: a.url,
        sentiment: sentimentSummary,
        keyphrases: a.keyphrases,
        people: a.people,
        orgs: a.orgs,
        places: a.places,
        readability: a.readability,
        keyPoints
      }
      setJsonData(JSON.stringify(json, null, 2))

      const fixLen = (str, len) => {
        if (!str) return ''
        return str.length > len ? str.substring(0, len) + '...' : str
      }
      const enhancedArticle = {
        ...a,
        metadescription: fixLen(a.metadescription, 158),
        titlePreview: fixLen(a.title, 71),
        url: fixLen(a.url, 71),
        sentiment: a.sentiment,
        keyPoints
      }

      setArticle(enhancedArticle)
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

  const readabilityItems = useMemo(() => buildReadabilityItems(article?.readability), [article?.readability])

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
              <div className='analysis-stack'>
                <h2>{article.title}</h2>
                {article.keyPoints && article.keyPoints.length > 0 && (
                  <div>
                    <ul className='key-points-list'>
                      {article.keyPoints.map((sentence, index) => (
                        <li key={index}>{sentence}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {readabilityItems.length > 0 && (
                  <div className='analysis-card readability-card'>
                    <h3>Readability</h3>
                    <div className='readability-grid'>
                      {readabilityItems.map((item) => (
                        <div className='readability-item' key={item.label}>
                          <span className='readability-item-label'>{item.label}</span>
                          <span className='readability-item-value'>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {article.sentiment && (
                  <div className='analysis-card sentiment-card'>
                    <h3>Sentiment</h3>
                    <div className='sentiment-summary'>
                      <span className={sentimentClassName(article.sentiment.result)}>{article.sentiment.result}</span>
                      {typeof article.sentiment.score === 'number' && (
                        <span className='sentiment-detail'>Score: {article.sentiment.score.toFixed(2)}</span>
                      )}
                      {typeof article.sentiment.comparative === 'number' && (
                        <span className='sentiment-detail'>Comparative: {article.sentiment.comparative.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                )}

                {article.keyphrases.length > 0 && (
                  <div className='analysis-card tag-card'>
                    <h3>Keyphrases</h3>
                    <div className='tag-list'>
                      {article.keyphrases.map((k) => <span key={k.keyphrase} className='tag'>{k.keyphrase}</span>)}
                    </div>
                  </div>
                )}

                {article.people.length > 0 && (
                  <div className='analysis-card tag-card'>
                    <h3>People</h3>
                    <div className='tag-list'>
                      {article.people.map((p) => <span key={p} className='tag'>{p}</span>)}
                    </div>
                  </div>
                )}

                {article.orgs.length > 0 && (
                  <div className='analysis-card tag-card'>
                    <h3>Organisations &amp; Groups</h3>
                    <div className='tag-list'>
                      {article.orgs.map((o) => <span key={o} className='tag'>{o}</span>)}
                    </div>
                  </div>
                )}

                {article.places.length > 0 && (
                  <div className='analysis-card tag-card'>
                    <h3>Places</h3>
                    <div className='tag-list'>
                      {article.places.map((p) => <span key={p} className='tag'>{p}</span>)}
                    </div>
                  </div>
                )}

                {article.spelling.length > 0 && (
                  <div className='analysis-card spelling-card'>
                    <h3>Spelling</h3>
                    <ul className='spelling-list'>
                      {article.spelling.map((w, i) => (
                        <li key={i}>
                          <span className='spelling-badge'>Line {w.line}</span>
                          <span>{w.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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
                <Image src={`data:image/png;base64,${article.screenshot}`} alt='' width={570} height={1400} unoptimized />
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
