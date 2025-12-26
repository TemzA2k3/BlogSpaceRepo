import { useEffect, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux/reduxHooks";
import { useAlert } from "@/app/providers/alert/AlertProvider";

import {
    fetchSettings,
    updateSettings,
    clearSettingsError,
} from "@/store/slices/authSlice";

import type { UpdateSettingsPayload } from "@/shared/types/user.types";

export const useSettings = () => {
    const dispatch = useAppDispatch();

    const {
        currentUser,
        settingsLoading: loading,
        settingsUpdating: updating,
        settingsError: error,
    } = useAppSelector((state) => state.auth);

    const { showAlert } = useAlert();

    const loadSettings = useCallback(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    const handleUpdateSettings = useCallback(
        async (payload: UpdateSettingsPayload) => {
            const result = await dispatch(updateSettings(payload));
            return { success: !updateSettings.rejected.match(result) };
        },
        [dispatch]
    );

    const handleUpdateSetting = useCallback(
        async <K extends keyof UpdateSettingsPayload>(key: K, value: UpdateSettingsPayload[K]) => {
            return handleUpdateSettings({ [key]: value } as UpdateSettingsPayload);
        },
        [handleUpdateSettings]
    );

    const handleClearError = useCallback(() => {
        dispatch(clearSettingsError());
    }, [dispatch]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    useEffect(() => {
        if (!error) return;

        showAlert(error, 'error')
    }, [error])

    return {
        settings: currentUser,
        loading,
        updating,
        error,
        refetch: loadSettings,
        updateSettings: handleUpdateSettings,
        updateSetting: handleUpdateSetting,
        clearError: handleClearError,
    };
};