import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    QueryDocumentSnapshot,
    DocumentData
} from '@firebase/firestore';
import { db } from '../firebaseConfig';
import { Video } from '../types';

const FIREBASE_NOT_CONFIGURED_ERROR = "Firestore is not configured. Please check your firebaseConfig.ts file.";

export const getVideos = async (): Promise<Video[]> => {
    if (!db) {
        console.error(FIREBASE_NOT_CONFIGURED_ERROR);
        // Return an empty array if Firebase isn't set up, preventing a crash.
        return [];
    }

    // This function now explicitly maps fields to prevent non-serializable data from being included.
    // This is the fix for the "Converting circular structure to JSON" error.
    const mapDocToVideo = (doc: QueryDocumentSnapshot<DocumentData>): Video => {
        const data = doc.data();
        return {
            id: doc.id,
            url: data.url || '',
            title: data.title || 'Untitled',
            category: data.category || 'Uncategorized',
            thumbnail: data.thumbnail || '',
            // Convert Firestore Timestamp to a standard JS Date object.
            // This is crucial to prevent "circular structure" errors when passing data to React components.
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        };
    };

    try {
        const videosCollectionRef = collection(db, "videos");
        const q = query(videosCollectionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        // Simply return the videos from Firestore, or an empty array if the collection is empty.
        return snapshot.docs.map(mapDocToVideo);
    } catch (error: any) {
        // The "Could not reach Cloud Firestore backend" error is often caused by security rules.
        // Please check your Firebase project's Firestore rules to ensure that unauthenticated
        // reads are allowed for the 'videos' collection.
        console.error("Error fetching videos from Firestore. This might be a security rules issue.", error.message || error);
        // Return an empty array on error to prevent the app from crashing.
        return [];
    }
};

export const addVideo = async (video: Omit<Video, 'id' | 'createdAt'>): Promise<string> => {
    if (!db) throw new Error(FIREBASE_NOT_CONFIGURED_ERROR);
    const videosCollectionRef = collection(db, "videos");
    const docRef = await addDoc(videosCollectionRef, { ...video, createdAt: serverTimestamp() });
    return docRef.id;
};

export const updateVideo = async (id: string, video: Partial<Omit<Video, 'id' | 'createdAt'>>): Promise<void> => {
    if (!db) throw new Error(FIREBASE_NOT_CONFIGURED_ERROR);
    const videoDocRef = doc(db, "videos", id);
    return await updateDoc(videoDocRef, video);
};

export const deleteVideo = async (id: string): Promise<void> => {
    if (!db) throw new Error(FIREBASE_NOT_CONFIGURED_ERROR);
    const videoDocRef = doc(db, "videos", id);
    return await deleteDoc(videoDocRef);
};