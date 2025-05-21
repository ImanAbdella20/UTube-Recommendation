'use client';

import React, { useEffect, useState } from 'react';
import { Note, useNoteStore } from '@/store/videoStore';
import { useAuth } from '@/context/AuthContext';
import { FiTrash2, FiSearch, FiVideo, FiClock, FiBookmark, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

interface NoteWithVideo extends Note {
    videoTitle?: string;
    videoThumbnail?: string;
}

const MAX_VISIBLE_NOTES = 2;

const SavedNotes = () => {
    const { userId } = useAuth();
    const { getUserNotes, removeNote } = useNoteStore();
    const [groupedNotes, setGroupedNotes] = useState<Record<string, NoteWithVideo[]>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedVideos, setExpandedVideos] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!userId) return;

        const fetchNotes = async () => {
            setLoading(true);
            try {
                const userNotes = getUserNotes(userId);

                // Enrich and group notes by videoId
                const enhanced = userNotes.map(note => ({
                    ...note,
                    videoTitle: `Video ${note.videoId.slice(0, 6)}`,
                    videoThumbnail: '/default-thumbnail.jpg',
                }));

                const grouped = enhanced.reduce((acc, note) => {
                    if (!acc[note.videoId]) acc[note.videoId] = [];
                    acc[note.videoId].push(note);
                    return acc;
                }, {} as Record<string, NoteWithVideo[]>);

                setGroupedNotes(grouped);
            } catch (err) {
                console.error('Failed to fetch notes', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
        window.addEventListener('notes-updated', fetchNotes);
        return () => window.removeEventListener('notes-updated', fetchNotes);
    }, [userId, getUserNotes]);

    const handleRemoveNote = (noteId: string) => {
        if (userId) {
            removeNote(userId, noteId);
        }
    };

    const toggleExpand = (videoId: string) => {
        setExpandedVideos(prev => ({
            ...prev,
            [videoId]: !prev[videoId],
        }));
    };

    const formatDate = (date: Date) =>
        new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });

    const filterGroupedNotes = () => {
        const query = searchQuery.toLowerCase();
        if (!query) return groupedNotes;

        const filtered: Record<string, NoteWithVideo[]> = {};
        for (const [videoId, notes] of Object.entries(groupedNotes)) {
            const matched = notes.filter(note =>
                note.content.toLowerCase().includes(query) ||
                note.videoTitle?.toLowerCase().includes(query)
            );
            if (matched.length > 0) {
                filtered[videoId] = matched;
            }
        }
        return filtered;
    };

    const filteredGroupedNotes = filterGroupedNotes();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Your Saved Notes</h1>
                        <p className="text-gray-600">{Object.values(filteredGroupedNotes).flat().length} total notes</p>
                    </div>

                    <div className="relative w-full md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {Object.keys(filteredGroupedNotes).length === 0 ? (
                    <div className="text-center bg-gray-50 p-8 rounded-xl">
                        <FiBookmark className="mx-auto text-gray-400 w-10 h-10 mb-4" />
                        <h3 className="text-xl text-gray-700 mb-2">No notes found</h3>
                        <p className="text-gray-500">
                            {searchQuery ? 'Try a different search' : "You haven't saved any notes yet."}
                        </p>
                        <Link
                            href="/videos"
                            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Browse Videos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(filteredGroupedNotes).map(([videoId, notes]) => {
                            const showAll = expandedVideos[videoId];
                            const visibleNotes = showAll ? notes : notes.slice(0, MAX_VISIBLE_NOTES);

                            return (
                                <div key={videoId} className="bg-white h-[200px] w-[80%] rounded-xl border border-gray-100 overflow-hidden ">
                                    <div className='grid md:grid-cols-2 sm:grid-cols-2'>
                                        <Link href={`/videos/${videoId}`} className="block">
                                            <div className="relative aspect-video bg-gray-200">
                                                <Image
                                                    src={notes[0].videoThumbnail || '/default-thumbnail.jpg'}
                                                    alt={notes[0].videoTitle || 'Video thumbnail'}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gray-500 bg-opacity-10 flex items-center justify-center">
                                                    <FiVideo className="text-white w-8 h-8" />
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="p-5 pb-7">
                                            <div className="flex justify-between items-center mb-4">
                                                <Link href={`/videos/${videoId}`}>
                                                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
                                                        {notes[0].videoTitle || 'Untitled Video'}
                                                    </h3>
                                                </Link>
                                            </div>

                                            <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                                                {notes.map(note => (
                                                    <div key={note.id} className="bg-blue-50 p-3 rounded-lg relative group">
                                                        <p className="text-sm text-gray-800 whitespace-pre-line">{note.content}</p>
                                                        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                            <span className="flex items-center">
                                                                <FiClock className="mr-1" />
                                                                {formatDate(note.createdAt)}
                                                            </span>
                                                            <button
                                                                onClick={() => handleRemoveNote(note.id)}
                                                                className="text-gray-400 hover:text-red-500 transition"
                                                                aria-label="Delete note"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedNotes;
