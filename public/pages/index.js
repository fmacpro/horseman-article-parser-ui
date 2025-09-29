import { useState, useEffect, useMemo } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Image from 'next/image'
import io from 'socket.io-client'

let socket

const MAX_KEY_POINTS = 3

const IRRELEVANT_IMAGE_PATTERNS = [
  /pixel/i,
  /spacer/i,
  /sprite/i,
  /icon/i,
  /logo/i,
  /badge/i,
  /spinner/i,
  /placeholder/i,
  /tracking/i,
  /1x1/i,
  /analytics/i
]

const IMAGES_PER_PAGE = 1
const EMPTY_IMAGE_LIST = Object.freeze([])

const filterRelevantImages = (images) => {
  if (!Array.isArray(images)) return []
  const seen = new Set()
  return images
    .filter((img) => img && typeof img.src === 'string' && img.src.trim() !== '')
    .map((img) => ({ ...img, src: img.src.trim() }))
    .filter((img) => {
      const src = img.src.toLowerCase()
      const alt = (img.alt || '').toLowerCase()
      if (src.startsWith('data:')) return false
      if (src.endsWith('.svg') && !alt) return false
      const descriptor = `${src} ${alt}`
      return !IRRELEVANT_IMAGE_PATTERNS.some((pattern) => pattern.test(descriptor))
    })
    .filter((img) => {
      if (seen.has(img.src)) return false
      seen.add(img.src)
      return true
    })
}

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
  const [imagePage, setImagePage] = useState(0)
  const [imagePageTransition, setImagePageTransition] = useState(false)

  useEffect(() => {
    socket = io()

    socket.on('parse:article', (a) => {
      const sentences = Array.isArray(a?.text?.sentences) ? a.text.sentences.filter(Boolean) : []
      const keyPoints = sentences.slice(0, MAX_KEY_POINTS)
      const sentimentSummary = a.sentiment
        ? { score: a.sentiment.score, comparative: a.sentiment.comparative }
        : null

      const filteredImages = filterRelevantImages(a.images)

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
        keyPoints,
        images: filteredImages
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
        keyPoints,
        images: filteredImages
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

  const articleImages = Array.isArray(article?.images) ? article.images : EMPTY_IMAGE_LIST

  useEffect(() => {
    setImagePage(0)
  }, [articleImages])

  const totalImagePages = useMemo(() => {
    if (articleImages.length === 0) return 0
    return Math.ceil(articleImages.length / IMAGES_PER_PAGE)
  }, [articleImages])

  useEffect(() => {
    if (imagePage > 0 && totalImagePages > 0 && imagePage > totalImagePages - 1) {
      setImagePage(totalImagePages - 1)
    }
  }, [imagePage, totalImagePages])

  const currentImagePage = totalImagePages > 0 ? Math.min(imagePage, totalImagePages - 1) : 0

  const paginatedImages = useMemo(() => {
    if (articleImages.length === 0) return EMPTY_IMAGE_LIST
    const start = currentImagePage * IMAGES_PER_PAGE
    return articleImages.slice(start, start + IMAGES_PER_PAGE)
  }, [articleImages, currentImagePage])

  useEffect(() => {
    if (totalImagePages === 0) {
      setImagePageTransition(false)
      return
    }
    setImagePageTransition(true)
    const timeout = setTimeout(() => setImagePageTransition(false), 240)
    return () => clearTimeout(timeout)
  }, [currentImagePage, totalImagePages])

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

                {articleImages.length > 0 && (
                  <div className='analysis-card image-gallery-card'>
                    <h3>Images</h3>
                    <div className={`article-image-grid${imagePageTransition ? ' article-image-grid-animating' : ''}`}>
                      {paginatedImages.map((image) => (
                        <figure className='article-image-item' key={image.src || String(image.index)}>
                          <img src={image.src} alt={image.alt || article.title || 'Article image'} loading='lazy' />
                          {image.alt && <figcaption>{image.alt}</figcaption>}
                        </figure>
                      ))}
                    </div>
                    {totalImagePages > 1 && (
                      <div className='article-image-pagination'>
                        <button
                          type='button'
                          className='btn btn-default btn-sm'
                          onClick={() => setImagePage((prev) => Math.max(prev - 1, 0))}
                          disabled={currentImagePage === 0}
                        >
                          Previous
                        </button>
                        <span className='article-image-pagination-info'>
                          {currentImagePage + 1} of {totalImagePages}
                        </span>
                        <button
                          type='button'
                          className='btn btn-default btn-sm'
                          onClick={() => setImagePage((prev) => Math.min(prev + 1, totalImagePages - 1))}
                          disabled={currentImagePage >= totalImagePages - 1}
                        >
                          Next
                        </button>
                      </div>
                    )}
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
