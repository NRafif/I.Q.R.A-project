import { getTreeByIdServer } from '@/lib/data-server'

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }) {
  try {
    const { id } = await params
    const tree = await getTreeByIdServer(id)
    
    if (!tree || !tree.id) {
      return {
        title: 'Pohon Tidak Ditemukan | I.Q.R.A',
        description: 'Pohon yang Anda cari tidak ditemukan dalam database I.Q.R.A',
      }
    }

    const title = `${tree.common_name} (${tree.scientific_name}) | I.Q.R.A`
    const description = tree.content?.sky_section?.sub_headline || 
                       `${tree.common_name} - ${tree.scientific_name}. Pelajari lebih lanjut tentang pohon ini di I.Q.R.A`
    const keywords = `${tree.common_name}, ${tree.scientific_name}, ${tree.family}, pohon, arboretum, edukasi lingkungan, I.Q.R.A`

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'id_ID',
        siteName: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/tree/${tree.id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
      description: 'Sistem Informasi Digital Pohon - Belajar tentang pohon melalui teknologi QR Code',
    }
  }
}

export default function TreeLayout({ children }) {
  return children
}

