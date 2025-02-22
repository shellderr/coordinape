import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import type * as Stitches from '@stitches/react';
import { CSS, disabledStyle, styled } from 'stitches.config';

import { modifyVariantsForStory } from '../type-utils';
import { Check, ChevronDown, ChevronUp, Info } from 'icons/__generated';
import { Flex, Text, Tooltip } from 'ui';

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  flex: 1,
  justifyContent: 'space-between',
  borderRadius: '$3',
  border: '1px solid $formInputBorder',
  padding: '$sm',
  lineHeight: '$short',
  fontSize: '$medium',
  width: 'calc(100% - $sm - $sm)',
  backgroundColor: '$formInputBackground',
  color: '$text',
  '&:hover': { cursor: 'pointer' },
  '&:disabled': disabledStyle,
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$formInputSelectBackground',
  boxShadow: '$heavy',
  borderRadius: '$3',
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  lineHeight: 1,
  color: '$text',
  borderRadius: '$1',
  display: 'flex',
  alignItems: 'center',
  padding: '$sm $lg',
  position: 'relative',
  userSelect: 'none',
  '&:focus, &:hover': {
    backgroundColor: '$formInputSelectHover',
    color: '$text',
  },
  '&[data-disabled]': disabledStyle,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: '$surface',
  color: '$grey10',
  cursor: 'default',
};

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// Exports
export const RadixSelect = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectIcon = SelectPrimitive.Icon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

export type SelectOption = {
  value: React.ReactText;
  label: React.ReactText;
  icon?: React.ReactElement;
  disabled?: boolean;
};

export const Select = (
  props: SelectProps & {
    id?: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    css?: CSS;
    label?: React.ReactNode;
    infoTooltip?: React.ReactNode;
  }
) => {
  const {
    id,
    css,
    defaultValue,
    options,
    placeholder,
    disabled,
    label,
    infoTooltip,
  } = props;

  return (
    <Flex
      column
      css={{
        gap: '$xs',
        ...css,
      }}
    >
      {(label || infoTooltip) && (
        <Text variant="label" as="label" htmlFor={id}>
          {label}{' '}
          {infoTooltip && (
            <Tooltip content={<div>{infoTooltip}</div>}>
              <Info size="sm" />
            </Tooltip>
          )}
        </Text>
      )}
      <RadixSelect defaultValue={defaultValue} {...props}>
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder={placeholder} />
          <SelectIcon>
            <ChevronDown color="neutral" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent style={{ zIndex: 6 }}>
          <SelectScrollUpButton>
            <ChevronUp color="neutral" />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectGroup id={id}>
              {options.map(({ value, label, disabled, icon }) => (
                <SelectItem
                  disabled={disabled}
                  value={String(value)}
                  key={value}
                >
                  <SelectItemText>
                    {icon} {label}
                  </SelectItemText>
                  <SelectItemIndicator>
                    <Check />
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDown />
          </SelectScrollDownButton>
        </SelectContent>
      </RadixSelect>
    </Flex>
  );
};

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof Select>;
type ComponentProps = ComponentVariants;

export const SelectStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof Select
>(Select);
