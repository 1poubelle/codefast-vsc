'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

const CardBoardLink = () => {
  // State pour stocker l'URL complète de la page courante
  const [url, setUrl] = useState('')
  // State pour empêcher les clics multiples
  const [isCopying, setIsCopying] = useState(false)

  useEffect(() => {
    // Capturer l'URL complète (locale ou web)
    const currentUrl = window.location.href
    // Supprimer /dashboard de l'URL pour l'affichage
    const displayUrl = currentUrl.replace('/dashboard', '')
    setUrl(displayUrl)
    console.log('URL complète capturée:', currentUrl)
    console.log('URL affichée:', displayUrl)
  }, [])

  // Fonction pour copier l'URL dans le presse-papiers
  const copyToClipboard = async () => {
    // Empêcher les clics multiples rapides
    if (isCopying) return
    
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(url)
      console.log('URL copiée:', url)
      // Dismiss any existing toasts first
      toast.dismiss()
      toast.success('URL copiée!')
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      toast.dismiss()
      toast.error('Erreur lors de la copie')
    } finally {
      // Réactiver après un délai de 2 secondes
      setTimeout(() => setIsCopying(false), 2000)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Case avec l'URL complète */}
      {url && (
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="input input-bordered flex-1 font-mono text-xs sm:text-sm min-w-0 w-full truncate"
          />
          {/* Bouton pour copier */}
          <button 
            onClick={copyToClipboard}
            className="btn btn-primary flex-shrink-0"
          >
            <DocumentDuplicateIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CardBoardLink
