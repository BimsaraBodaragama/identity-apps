/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { store } from "@wso2is/admin.core.v1/store";
import { ServerConfigurationsInterface, getServerConfigs } from "@wso2is/admin.server-configurations.v1";
import { RolesInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import { ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import Tree from "rc-tree";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid } from "semantic-ui-react";
import { RoleConstants } from "../../constants";
import { TreeNode } from "../../models/permission";
import { RoleManagementUtils } from "../../utils";

/**
 * Interface to capture permission list props
 */
interface PermissionListProp extends  TestableComponentInterface {
    /**
     * Should the content be emphasized.
     */
    emphasize?: boolean;
    triggerSubmit?: boolean;
    onSubmit?: (checkedPermission: TreeNode[]) => void;
    roleObject?: RolesInterface;
    isEdit: boolean;
    initialValues?: TreeNode[];
    isRole?: boolean;
    isReadOnly?: boolean;
    /**
     * Permissions to hide.
     */
    permissionsToHide?: string[];
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Component to create the permission tree structure from the give permission list.
 *
 * @param props - props containing event handlers for permission component
 */
export const PermissionList: FunctionComponent<PermissionListProp> = (props: PermissionListProp): ReactElement => {

    const {
        isReadOnly,
        emphasize,
        triggerSubmit,
        onSubmit,
        roleObject,
        isEdit,
        initialValues,
        isRole,
        isSubmitting,
        permissionsToHide,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ permissions, setPermissions ] = useState<TreeNode[]>([]);
    const [ checkedPermission, setCheckedPermission ] = useState<TreeNode[]>([]);
    const [ previouslyCheckedKeys, setPreviouslyCheckedKeys ] = useState<string[]>([]);
    const [ defaultExpandedKeys, setDefaultExpandKeys ] = useState<string[]>([]);
    const [ isPermissionsLoading, setIsPermissionsLoading ] = useState<boolean>(true);
    const [ isSuperAdmin, setIsSuperAdmin ] = useState<boolean>(false);

    useEffect(() => {
        const checkedNodes: TreeNode[] = [];

        RoleManagementUtils.getAllPermissions(permissionsToHide)
            .then((permissionTree: TreeNode[]) => {
                disableSuperAdminTreeNode(isSuperAdmin, permissionTree);
                setPermissions(permissionTree);
                setDefaultExpandKeys([ permissionTree[ 0 ].key.toString() ]);
                setIsPermissionsLoading(false);
            });
        checkIsSuperAdmin();

        if ( initialValues && initialValues.length > 0 ) {
            const previousFormCheckedKeys: string[] = [];

            initialValues.forEach((initialKey: TreeNode) => {
                previousFormCheckedKeys.push(initialKey.key.toString());
            });
            setPreviouslyCheckedKeys(previousFormCheckedKeys);
            previouslyCheckedKeys?.forEach((key: string) => {
                checkedNodes.push(getNodeByKey(key, permissions));
            });
            setCheckedPermission(checkedNodes);
        }

        if (isRole && roleObject) {
            setPreviouslyCheckedKeys(roleObject.permissions as string[]);
            previouslyCheckedKeys?.forEach((key: string) => {
                checkedNodes.push(getNodeByKey(key, permissions));
            });
            setCheckedPermission(checkedNodes);
        }
    }, [ permissions.length > 0 ]);

    /**
     * Util function to check if current user is a super admin.
     */
    const checkIsSuperAdmin = () => {
        getServerConfigs().then((response: ServerConfigurationsInterface) => {
            const loggedUserName: string = store.getState().profile.profileInfo.userName;
            const adminUser: string = response?.realmConfig.adminUser;

            if (loggedUserName === adminUser) {
                setIsSuperAdmin(true);
            }
        }).catch((_error: unknown) => {
            setIsSuperAdmin(false);
        });
    };

    /**
     * Utill method to disable super admin permissions when `isSuperAdmin` is false.
     *
     * @param isSuperAdmin - is super admin check
     * @param permissionTree - permission tree to change
     */
    const disableSuperAdminTreeNode = (isSuperAdmin: boolean, permissionTree: TreeNode[]) => {
        permissionTree[0].children.forEach((permission: TreeNode) => {
            if (permission.key === RoleConstants.SUPER_ADMIN_PERMISSION_KEY && !isSuperAdmin) {
                permission.disableCheckbox = true;
                if (permission.children) {
                    disableTreeNode(permission.children, true);
                }
            }
        });
    };

    /**
     * Util function to disable checking of a node and it's children.
     *
     * @param permissionNodes - array of permission nodes
     * @param state - disable state
     */
    const disableTreeNode = (permissionNodes: TreeNode[], state: boolean) => {
        permissionNodes.forEach((permission: TreeNode) => {
            permission.disableCheckbox = state;
            if (permission.children) {
                disableTreeNode(permission.children, state);
            }
        });
    };

    /**
     * Event handler when a node is checked on the permission tree.
     *
     * @param checked - checked states of the node
     * @param info - checked information
     */
    // eslint-disable-next-line @typescript-eslint/typedef
    const onCheck = (checked: { checked: React.ReactText[]; halfChecked: React.ReactText[] }, info) => {
        if (info.checked) {
            if (!checkedPermission.find((permission: TreeNode) => permission.key === info.node.key)) {
                const parentNode: TreeNode = getNodeByKey(info.node.key, permissions, true);
                let checkedChildren: number = 1;

                parentNode?.children?.forEach((childPermission: TreeNode) => {
                    if ( checkedPermission.filter((checkedPermission: TreeNode) =>
                        checkedPermission.key === childPermission.key).length > 0 ) {
                        ++checkedChildren;
                    }
                });
                if (parentNode?.children?.length === checkedChildren) {
                    const filteredCheckedPermissions: TreeNode[] = checkedPermission.filter((permission: TreeNode) => {
                        permission.key.toString().replace(/^\/|\/$/g, "").split("/") === parentNode.key.toString()
                            .replace(/^\/|\/$/g, "").split("/");
                    });

                    setCheckedPermission([ ...filteredCheckedPermissions, parentNode ]);
                } else {
                    setCheckedPermission([ ...checkedPermission, info.node ]);
                }
            }
        } else {
            setCheckedPermission(info.checkedNodes);
        }
    };

    /**
     * Util method to find a node from a given key.
     *
     * @param key - key to be found
     * @param permissionTree - permission tree to traverse
     * @param isParent - condition to find the parent of the key node
     */
    const getNodeByKey = (key: string, permissionTree: TreeNode[], isParent: boolean = false): TreeNode => {
        const flattenedTree: TreeNode[] = [ permissionTree[0] ];

        while ( flattenedTree.length ) {
            const node: TreeNode = flattenedTree.shift();

            if (isParent) {
                if ( node.key === key.slice(0,key.lastIndexOf("/")) ) {
                    return node;
                }
            } else {
                if (node.key === key) {
                    return node;
                }
            }

            if ( node.children ) {
                flattenedTree.push(...node.children);
            }
        }

        return null;
    };

    /**
     * Util method to get a custom expander icon for
     * the tree nodes.
     * @param eventObject - event object
     */
    // eslint-disable-next-line @typescript-eslint/typedef
    const switcherIcon = (eventObject) => {
        if (eventObject.isLeaf) {
            return null;
        }

        return (
            <div className="tree-arrow-wrap">
                <span className={ `tree-arrow ${ !eventObject.expanded ? "active" : "" }` }>
                    <span></span>
                    <span></span>
                </span>
            </div>
        );
    };

    const renderChildren = (): ReactElement => (
        <>
            <Forms
                submitState={ triggerSubmit }
                onSubmit={ () => { onSubmit(checkedPermission); } }
            >
                {
                    !isPermissionsLoading
                        ? (
                            <div className="treeview-container">
                                <Tree
                                    className={ "customIcon" }
                                    data-testid={ `${ testId }-tree` }
                                    disabled={ isReadOnly }
                                    checkedKeys={ checkedPermission.map( (permission: TreeNode) => permission.key ) }
                                    defaultExpandedKeys={ defaultExpandedKeys }
                                    showLine
                                    showIcon={ false }
                                    checkable
                                    selectable={ false }
                                    onCheck={ onCheck }
                                    treeData={ permissions }
                                    switcherIcon={ switcherIcon }
                                />
                            </div>
                        )
                        : <ContentLoader className="p-3" active />
                }
                { isEdit && !isPermissionsLoading && (
                    <>
                        <Divider hidden/>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button
                                    data-testid={ `${ testId }-update-button` }
                                    primary
                                    type="submit"
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    size="small"
                                    className="form-button"
                                >
                                    { t("roles:addRoleWizard.permissions.buttons.update") }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </>
                ) }
            </Forms>
        </>
    );

    return (
        emphasize
            ? (
                <EmphasizedSegment data-testid={ testId } padded="very">
                    { renderChildren() }
                </EmphasizedSegment>
            )
            : (
                <div data-testid={ testId }>
                    { renderChildren() }
                </div>
            )
    );
};

/**
 * Default props for the component.
 */
PermissionList.defaultProps = {
    emphasize: true,
    isReadOnly: false
};
