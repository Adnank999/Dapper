import { css, cx } from '@emotion/css'
import React, { PropsWithChildren, ReactNode, Ref } from 'react'
import ReactDOM from 'react-dom'

interface BaseProps {
  className?: string
  ref?: Ref<any>
  [key: string]: unknown
}

export const Button = ({
  className,
  active,
  reversed,
  ...props
}: PropsWithChildren<{
  active: boolean
  reversed?: boolean
} & BaseProps>) => {
  return (
    <span
      {...props}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'};
        `
      )}
    />
  )
}

export const Icon = ({
  className,
  children,
  ...props
}: PropsWithChildren<BaseProps>) => {
  return (
    <span
      {...props}
      className={cx(
        'material-icons',
        className,
        css`
          font-size: 18px;
          vertical-align: text-bottom;
        `
      )}
    >
      {children}
    </span>
  );
};


export const Instruction = ({
  className,
  ...props
}: PropsWithChildren<BaseProps>) => {
  return (
    <div
      {...props}
      className={cx(
        className,
        css`
          white-space: pre-wrap;
          margin: 0 -20px 10px;
          padding: 10px 20px;
          font-size: 14px;
          background: #f8f8e8;
        `
      )}
    />
  )
}

export const Menu = ({ className, ...props }: PropsWithChildren<BaseProps>) => {
  return (
    <div
      {...props}
      data-test-id="menu"
      className={cx(
        className,
        css`
          & > * {
            display: inline-block;
          }

          & > * + * {
            margin-left: 15px;
          }
        `
      )}
    />
  )
}

export const Portal = ({ children }: { children?: ReactNode }) => {
  return typeof document === 'object'
    ? ReactDOM.createPortal(children, document.body)
    : null
}

export const Toolbar = ({ className, ...props }: PropsWithChildren<BaseProps>) => {
  return (
    <Menu
      {...props}
      className={cx(
        className,
        css`
          position: relative;
          padding: 1px 18px 17px;
          margin: 0 -20px;
          border-bottom: 2px solid #eee;
          margin-bottom: 20px;
        `
      )}
    />
  )
}
