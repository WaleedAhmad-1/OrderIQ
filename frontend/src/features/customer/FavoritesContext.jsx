import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../../services/user.service';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

const FavoritesContext = createContext(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const { isAuthenticated, profile } = useAuth();
    const [favorites, setFavorites] = useState([]);       // Full favorite objects (with restaurant data)
    const [favoriteIds, setFavoriteIds] = useState(new Set()); // Set of restaurant IDs for O(1) lookup
    const [loading, setLoading] = useState(false);

    // Fetch favorites from API
    const refreshFavorites = useCallback(async () => {
        if (!isAuthenticated || !profile) return;

        try {
            setLoading(true);
            const res = await userService.getFavorites();
            const favs = res.data?.data || res.data || [];
            setFavorites(favs);
            setFavoriteIds(new Set(favs.map(f => f.restaurantId || f.restaurant?.id)));
        } catch (err) {
            console.error('[FavoritesContext] Error fetching favorites:', err);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, profile]);

    // Load favorites when user authenticates
    useEffect(() => {
        if (isAuthenticated && profile) {
            refreshFavorites();
        } else {
            setFavorites([]);
            setFavoriteIds(new Set());
        }
    }, [isAuthenticated, profile, refreshFavorites]);

    // O(1) lookup
    const isFavorite = useCallback((restaurantId) => {
        return favoriteIds.has(restaurantId);
    }, [favoriteIds]);

    // Optimistic toggle
    const toggleFavorite = useCallback(async (restaurantId) => {
        if (!isAuthenticated) {
            toast.error('Please log in to save favorites');
            return;
        }

        const wasFavorited = favoriteIds.has(restaurantId);

        // Optimistic update
        setFavoriteIds(prev => {
            const next = new Set(prev);
            if (wasFavorited) {
                next.delete(restaurantId);
            } else {
                next.add(restaurantId);
            }
            return next;
        });

        if (wasFavorited) {
            setFavorites(prev => prev.filter(f => (f.restaurantId || f.restaurant?.id) !== restaurantId));
        }

        try {
            await userService.toggleFavorite(restaurantId);

            // After successful toggle, if we ADDED, refresh to get the full restaurant data
            if (!wasFavorited) {
                await refreshFavorites();
            }
        } catch (err) {
            // Revert on error
            console.error('[FavoritesContext] Toggle error:', err);
            toast.error('Failed to update favorites');
            setFavoriteIds(prev => {
                const next = new Set(prev);
                if (wasFavorited) {
                    next.add(restaurantId);
                } else {
                    next.delete(restaurantId);
                }
                return next;
            });
            if (wasFavorited) {
                await refreshFavorites(); // Re-fetch to restore full data
            }
        }
    }, [isAuthenticated, favoriteIds, refreshFavorites]);

    const value = {
        favorites,       // Full array — for Favorites page and future recommendation engine
        favoriteIds,     // Set of IDs — for recommendation engine direct access
        loading,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
