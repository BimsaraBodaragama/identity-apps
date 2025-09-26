/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { Claim } from "@wso2is/core/models";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import { Context, Dispatch, FunctionComponent, ReactNode, SetStateAction, createContext } from "react";
import { Base } from "../models/base";
import { FlowCompletionConfigsInterface, FlowsHistoryInterface } from "../models/flows";
import { MetadataInterface } from "../models/metadata";
import { Resource } from "../models/resources";

/**
 * Props interface of {@link AuthenticationFlowBuilderCoreContext}
 */
export interface AuthenticationFlowBuilderCoreContextProps {
    /**
     * The properties of the last interacted resource.
     */
    lastInteractedResource: Base;
    /**
     * The ID of the last user interacted resource node.
     */
    lastInteractedStepId: string;
    /**
     * The wrapper for the resource properties factory.
     */
    ResourceProperties: FunctionComponent<any>;
    /**
     * The heading for the element properties panel.
     */
    resourcePropertiesPanelHeading: ReactNode;
    /**
     * The primary i18n screen for the flow.
     */
    primaryI18nScreen: PreviewScreenType;
    /**
     * Indicates whether the element panel is open.
     */
    isResourcePanelOpen: boolean;
    /**
     * Indicates whether the element properties panel is open.
     */
    isResourcePropertiesPanelOpen: boolean;
    /**
     * Indicates whether the version history panel is open.
     */
    isVersionHistoryPanelOpen: boolean;
    /**
     * The factory for creating components.
     */
    ElementFactory: FunctionComponent<any>;
    /**
     * Function to be called when an element is dropped on the canvas.
     * @param element - The element that was dropped on the canvas.
     * @param nodeId - The ID of the node on which the element was dropped.
     */
    onResourceDropOnCanvas: (element: Base, nodeId: string) => void;
    /**
     * The set of attributes that are selected for the flow that are maintained per node.
     */
    selectedAttributes: {
        [key: string]: Claim[];
    };
    /**
     * Sets the latest interacted resource inside the canvas.
     */
    setLastInteractedResource: (resource: Resource) => void;
    /**
     * Sets the active element node ID.
     */
    setLastInteractedStepId: Dispatch<SetStateAction<string>>;
    /**
     * Sets the heading for the element properties panel.
     *
     * @param heading - The heading to set for the element properties panel.
     */
    setResourcePropertiesPanelHeading: Dispatch<SetStateAction<ReactNode>>;
    /**
     * Function to set the state of the element panel.
     *
     * @param isOpen - Boolean indicating whether the element panel should be open.
     */
    setIsResourcePanelOpen: Dispatch<SetStateAction<boolean>>;
    /**
     * Function to set the state of the element properties panel.
     *
     * @param isOpen - Boolean indicating whether the element properties panel should be open.
     */
    setIsOpenResourcePropertiesPanel: Dispatch<SetStateAction<boolean>>;
    /**
     * Function to set the state of the version history panel.
     */
    setIsVersionHistoryPanelOpen: Dispatch<SetStateAction<boolean>>;
    /**
     * Sets the selected attributes for the flow.
     */
    setSelectedAttributes: Dispatch<SetStateAction<{ [key: string]: Claim[] }>>;
    /**
     * Metadata for the current flow builder.
     */
    metadata?: MetadataInterface;
    /**
     * Configured i18n text from the branding or default fallback.
     */
    i18nText?: { [key in PreviewScreenType]?: Record<string, string> };
    /**
     * Indicates whether the i18n text is still loading.
     */
    i18nTextLoading?: boolean;
    /**
     * The language of the i18n text.
     */
    language?: string;
    /**
     * Sets the language for the i18n text.
     *
     * @param language - The language to set.
     */
    setLanguage?: (language: string) => void;
    /**
     * Updates an existing i18n key for the specified screen.
     *
     * @param screenType - The screen type for the i18n key.
     * @param language - The language for the i18n key.
     * @param i18nText - The i18n text to update.
     * @returns Promise indicating the success or failure of the update operation.
     */
    updateI18nKey?: (screenType: string, language: string, i18nText: Record<string, string>) => Promise<boolean>;
    /**
     * Indicates whether the i18n key related operations are in progress.
     */
    isI18nSubmitting?: boolean;
    /**
     * Function to check if a given i18n key is custom.
     *
     * @param key - The i18n key to check.
     * @param excludePrimaryScreen - Whether to exclude the primary screen from the check.
     * @returns True if the i18n key is custom, false otherwise.
     */
    isCustomI18nKey?: (key: string, excludePrimaryScreen?: boolean) => boolean;
    /**
     * Supported locales for the custom text preferences.
     */
    supportedLocales?: SupportedLanguagesMeta;
    /**
     * Indicates whether branding is enabled for the organization.
     */
    isBrandingEnabled?: boolean;
    /**
     * Flow completion configurations.
     */
    flowCompletionConfigs: FlowCompletionConfigsInterface;
    /**
     * Set the flow completion configurations.
     */
    setFlowCompletionConfigs: Dispatch<SetStateAction<FlowCompletionConfigsInterface>>;
    /**
     * Indicates whether the flow metadata is still loading.
     */
    isFlowMetadataLoading?: boolean;
    /**
     * Indicates whether local auto-save is enabled.
     */
    isAutoSaveLocalHistoryEnabled?: boolean;
    /**
     * Indicates whether an local auto-save operation is in progress.
     */
    isAutoSavingLocalHistory?: boolean;
    /**
     * The timestamp of the last successful local auto-save.
     */
    lastLocalHistoryAutoSaveTimestamp?: number | null;
    /**
     * Manually trigger an local auto-save operation.
     */
    triggerLocalHistoryAutoSave?: () => Promise<boolean>;
    /**
     * Enable or disable locally saved auto-save functionality.
     */
    setLocalHistoryAutoSaveEnabled?: (enabled: boolean) => void;
    /**
     * Check if there are locally saved drafts for this flow type.
     */
    hasLocalHistory?: boolean;
    /**
     * Clear all locally saved drafts for this flow type.
     */
    clearLocalHistory?: () => Promise<boolean>;
    /**
     * Restore flow from a specific history item.
     */
    restoreFromHistory?: (historyItem: FlowsHistoryInterface) => Promise<boolean>;
    /**
     * All locally saved drafts for the current flow type.
     */
    localHistory?: FlowsHistoryInterface[];
    /**
     * Node types active in the flow.
     */
    flowNodeTypes: NodeTypes;
    /**
     * Edge types active in the flow.
     */
    flowEdgeTypes: EdgeTypes;
    /**
     * Function to set the node types active in the flow.
     */
    setFlowNodeTypes: Dispatch<SetStateAction<NodeTypes>>;
    /**
     * Function to set the edge types active in the flow.
     */
    setFlowEdgeTypes: Dispatch<SetStateAction<EdgeTypes>>;
}

/**
 * Context object for managing the Authentication flow builder core context.
 */
const AuthenticationFlowBuilderCoreContext: Context<AuthenticationFlowBuilderCoreContextProps> = createContext<
    null | AuthenticationFlowBuilderCoreContextProps
>(
    {
        ElementFactory: () => null,
        ResourceProperties: () => null,
        clearLocalHistory: () => Promise.resolve(false),
        flowCompletionConfigs: {},
        flowEdgeTypes: {},
        flowNodeTypes: {},
        hasLocalHistory: false,
        i18nText: null,
        i18nTextLoading: false,
        isAutoSaveLocalHistoryEnabled: true,
        isAutoSavingLocalHistory: false,
        isBrandingEnabled: false,
        isCustomI18nKey: () => false,
        isFlowMetadataLoading: false,
        isResourcePanelOpen: true,
        isResourcePropertiesPanelOpen: false,
        isVersionHistoryPanelOpen: false,
        language: "",
        lastInteractedResource: null,
        lastInteractedStepId: "",
        lastLocalHistoryAutoSaveTimestamp: null,
        localHistory: [],
        metadata: null,
        onResourceDropOnCanvas: () => {},
        primaryI18nScreen: PreviewScreenType.COMMON,
        resourcePropertiesPanelHeading: null,
        restoreFromHistory: () => Promise.resolve(false),
        selectedAttributes: {},
        setFlowCompletionConfigs: () => {},
        setFlowEdgeTypes: () => {},
        setFlowNodeTypes: () => {},
        setIsOpenResourcePropertiesPanel: () => {},
        setIsResourcePanelOpen: () => {},
        setIsVersionHistoryPanelOpen: () => {},
        setLanguage: () => {},
        setLastInteractedResource: () => {},
        setLastInteractedStepId: () => {},
        setLocalHistoryAutoSaveEnabled: () => {},
        setResourcePropertiesPanelHeading: () => {},
        setSelectedAttributes: () => {},
        supportedLocales: {},
        triggerLocalHistoryAutoSave: () => Promise.resolve(false)
    }
);

AuthenticationFlowBuilderCoreContext.displayName = "AuthenticationFlowBuilderCoreContext";

export default AuthenticationFlowBuilderCoreContext;
