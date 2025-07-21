REPLACE:
  {{ .ConfirmationURL }}
 
WITH: 
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup