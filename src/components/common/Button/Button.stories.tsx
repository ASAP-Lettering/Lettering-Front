import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    buttonType: {
      control: { type: 'radio' },
      options: ['primary', 'secondary']
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large', 'default']
    },
    width: { control: 'text' },
    height: { control: 'text' },
    backgroundColor: { control: 'color' },
    text: { control: 'text' },
    icon: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    buttonType: 'primary',
    size: 'large',
    text: 'Primary Button'
  }
};

export const Secondary: Story = {
  args: {
    buttonType: 'secondary',
    size: 'medium',
    text: 'Secondary Button'
  }
};

export const WithIcon: Story = {
  args: {
    buttonType: 'primary',
    size: 'medium',
    text: 'Icon Button',
    icon: true
  }
};

export const Disabled: Story = {
  args: {
    buttonType: 'primary',
    text: 'Disabled Button',
    disabled: true
  }
};
