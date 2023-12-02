# Generated by Django 4.2.6 on 2023-10-17 15:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('internetOfThings', '0005_devicetypeparam_un_devicetypeparam_typename_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(unique=True)),
            ],
        ),
        migrations.AlterField(
            model_name='devicetype',
            name='name',
            field=models.CharField(unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.CreateModel(
            name='DeviceParamValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.CharField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('device', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='internetOfThings.device')),
                ('param', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='internetOfThings.devicetypeparam')),
            ],
        ),
        migrations.AddField(
            model_name='device',
            name='deviceType',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='internetOfThings.devicetype'),
        ),
        migrations.AddConstraint(
            model_name='deviceparamvalue',
            constraint=models.UniqueConstraint(fields=('device', 'param', 'timestamp'), name='UN_DeviceParamValue_device_param_timestamp'),
        ),
    ]