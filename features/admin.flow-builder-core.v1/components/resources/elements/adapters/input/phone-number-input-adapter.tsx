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

import FormHelperText from "@oxygen-ui/react/FormHelperText";
import PhoneNumberInput from "@oxygen-ui/react/PhoneNumberInput";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { CommonElementFactoryPropsInterface } from "../../common-element-factory";
import { Hint } from "../../hint";

/**
 * Props interface of {@link PhoneNumberInputAdapter}
 */
export type PhoneNumberInputAdapterPropsInterface = IdentifiableComponentInterface & CommonElementFactoryPropsInterface;

/**
 * Adapter for the Phone Number input component.
 *
 * @param props - Props injected to the component.
 * @returns The PhoneNumberInputAdapter component.
 */
export const PhoneNumberInputAdapter: FunctionComponent<PhoneNumberInputAdapterPropsInterface> = ({
    resource
}: PhoneNumberInputAdapterPropsInterface): ReactElement => (
    <>
        <PhoneNumberInput
            className={ resource.config?.className }
            label={ resource.config?.label }
            placeholder={ resource.config?.placeholder || "" }
            InputLabelProps={ {
                required: resource.config?.required
            } }
        />
        {
            resource.config?.hint && (
                <FormHelperText>
                    <Hint hint={ resource.config?.hint } />
                </FormHelperText>
            )
        }
    </>
);

export default PhoneNumberInputAdapter;
