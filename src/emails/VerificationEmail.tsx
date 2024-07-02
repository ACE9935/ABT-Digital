import * as React from 'react'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text
} from "@react-email/components"
import { configurations } from '@/app-configurations'

export default function MagicLinkEmail(url:string) {
  return (
    <Html>
  <Head />
  <Preview>Connectez-vous avec ce lien magique</Preview>
  <Body style={main}>
    <Container style={container}>
      <Heading style={h1}>Connectez-vous à {configurations.appName}</Heading>

      <Link
        href={url}
        target='_blank'
        style={{
          ...link,
          display: 'block',
          marginBottom: '16px'
        }}
      >
        Cliquez ici pour vous connecter avec ce lien magique
      </Link>

      <Text
        style={{
          ...text,
          color: '#ababab',
          marginTop: '14px',
          marginBottom: '16px'
        }}
      >
        Si vous n'avez pas essayé de vous connecter, vous pouvez ignorer cet email en toute sécurité.
      </Text>

      <Text style={footer}>
        <Link
          href={process.env.HOST}
          target='_blank'
          style={{ ...link, color: '#898989' }}
        >
          {configurations.appName}
        </Link>
      </Text>
    </Container>
  </Body>
</Html>

  )
}

const main = {
  backgroundColor: '#ffffff'
}

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto'
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0'
}

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline'
}

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0'
}

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px'
}

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333'
}