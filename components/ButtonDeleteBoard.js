'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

const ButtonDeleteBoard = ({ boardId, boardName, redirectAfterDelete = false }) => {
    // State pour gérer le chargement et empêcher les clics multiples
    const [isDeleting, setIsDeleting] = useState(false);
    // State pour afficher/masquer la modal de confirmation
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const router = useRouter();

    // Fonction pour effectuer la suppression
    const deleteBoard = async () => {
        setIsDeleting(true);
        try {
            // Appel API pour supprimer le board
            await axios.delete(`/api/board?id=${boardId}`);
            console.log('Board supprimé avec succès:', boardId);
            
            if (redirectAfterDelete) {
                // Rediriger vers le dashboard
                console.log('Redirection vers le dashboard');
                const toastId = toast.success('Board supprimé avec succès!');
                setTimeout(() => {
                    toast.dismiss(toastId);
                }, 1000);
                router.push('/dashboard');
            } else {
                // Rafraîchir la page pour mettre à jour la liste
                router.refresh();
                console.log('Page rafraîchie après suppression');
                
                // Toast après le refresh pour éviter les conflits
                setTimeout(() => {
                    const toastId = toast.success('Board supprimé avec succès!');
                    // Forcer la fermeture après 1 seconde
                    setTimeout(() => {
                        toast.dismiss(toastId);
                    }, 1000);
                }, 100);
            }
            
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression';
            toast.error(`Erreur: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Fonction pour afficher la modal de confirmation
    const handleDelete = () => {
        // Empêcher les clics multiples
        if (isDeleting) return;
        
        // Afficher la modal de confirmation
        setShowConfirmModal(true);
        console.log('Modal de confirmation affichée');
    };

    // Fonction pour annuler la suppression
    const handleCancel = () => {
        setShowConfirmModal(false);
        console.log('Suppression annulée par l\'utilisateur');
    };

    // Fonction pour confirmer la suppression
    const handleConfirm = () => {
        setShowConfirmModal(false);
        deleteBoard();
    };

    return (
        <>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`btn btn-error btn-sm ${isDeleting ? 'loading' : ''}`}
                title="Supprimer ce board"
            >
                {isDeleting ? (
                    <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Suppression...
                    </>
                ) : (
                    <TrashIcon className="h-4 w-4" />
                )}
            </button>

            {/* Modal de confirmation */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl border max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <TrashIcon className="h-6 w-6 text-red-500" />
                            <h3 className="font-semibold text-gray-900 text-lg">Confirmer la suppression</h3>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Êtes-vous sûr de vouloir supprimer le board <strong>&quot;{boardName}&quot;</strong> ? 
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={handleCancel}
                                className="btn btn-outline border-black text-black hover:bg-black hover:text-white"
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="btn btn-error"
                                disabled={isDeleting}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ButtonDeleteBoard;